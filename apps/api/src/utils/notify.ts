import { Notify } from "@afrisinc/notify-sdk"
import axios from 'axios';
import { emailTemplates } from './emailTemplates.js';
const apiKeys = process.env.NOTIFY_KEY;
const notify = new Notify({
    apiKey: apiKeys as any
})

export const sendEmail = async (
    channel: string,
    email: string,
    payload: Record<string, any>,
    templateId?: string,
): Promise<any> => {
    try {
        const apiUrl = process.env.NOTIFY_API_URL;
        const apiKey = process.env.NOTIFY_KEY;

        if (!apiUrl || !apiKey) {
            console.warn('[notify] NOTIFY_API_URL or NOTIFY_KEY is not set. Skipping external email dispatch.');
            return null;
        }

        const requestBody = {
            channel,
            recipient: email,
            payload: {
                subject: payload.subject || '',
                message: payload.message || payload.html || '',
            },
            ...(templateId && { templateId }),
        };

        console.log(`[notify] Sending ${channel} to ${email}...`, JSON.stringify(requestBody));
        const response = await axios.post(
            apiUrl,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 5000,
            }
        );

        console.log('[notify] Notify API response:', response.status, response.data);
        return response.data;
    } catch (err: any) {
        const status = err?.response?.status;
        const data = err?.response?.data;
        const message = err?.message;
        console.error('[notify] API call failed — status:', status, '| data:', JSON.stringify(data), '| message:', message);
        return null;
    }
};

export const sendVerificationEmail = async (
    name: string,
    email: string,
    verificationLink: string
): Promise<any> => {
    const html = emailTemplates.emailVerification({ name, email, verificationLink });
    return sendEmail('EMAIL', email, {
        subject: 'Verify your MindCare AI account',
        message: html,
    });
};

export const sendPasswordResetEmail = async (
    name: string,
    email: string,
    resetLink: string
): Promise<any> => {
    const html = emailTemplates.forgotPassword({ name, resetLink });
    return sendEmail('EMAIL', email, {
        subject: 'Reset your MindCare AI password',
        message: html,
    });
};

export default notify;