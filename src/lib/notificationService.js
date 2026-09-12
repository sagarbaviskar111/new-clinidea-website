// Notification System Architecture & Multi-Channel Service Abstraction

export const NOTIFICATION_TYPES = {
  SESSION_SCHEDULED: 'SESSION_SCHEDULED',
  SESSION_UPDATED: 'SESSION_UPDATED',
  SESSION_CANCELLED: 'SESSION_CANCELLED',
  NEW_RECORDING: 'NEW_RECORDING',
  NEW_STUDY_MATERIAL: 'NEW_STUDY_MATERIAL',
  NEW_QUESTION_BANK: 'NEW_QUESTION_BANK',
  NEW_EXAM: 'NEW_EXAM',
  EXAM_REMINDER: 'EXAM_REMINDER',
  ASSIGNMENT_CREATED: 'ASSIGNMENT_CREATED',
  ASSIGNMENT_DUE: 'ASSIGNMENT_DUE',
  ASSIGNMENT_GRADED: 'ASSIGNMENT_GRADED',
  FEE_DUE: 'FEE_DUE',
  FEE_OVERDUE: 'FEE_OVERDUE',
  CERTIFICATE_APPROVED: 'CERTIFICATE_APPROVED',
  REFERRAL_REWARD: 'REFERRAL_REWARD',
  LEAD_ASSIGNED: 'LEAD_ASSIGNED',
  FOLLOW_UP_DUE: 'FOLLOW_UP_DUE'
};

export class NotificationService {
  static async sendNotification({ userId, type, title, message, link = '', channels = ['in_app'] }) {
    console.log(`[NOTIFICATION DISPATCH] User: ${userId} | Type: ${type} | Title: ${title}`);

    const payload = {
      userId,
      type,
      title,
      message,
      link,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    if (channels.includes('email')) {
      console.log(`[EMAIL DISPATCH] Dispatching email to user ${userId}: ${title}`);
    }
    if (channels.includes('whatsapp')) {
      console.log(`[WHATSAPP DISPATCH] Dispatching WhatsApp message to user ${userId}: ${title}`);
    }
    if (channels.includes('sms')) {
      console.log(`[SMS DISPATCH] Dispatching SMS to user ${userId}: ${title}`);
    }
    if (channels.includes('push')) {
      console.log(`[PUSH DISPATCH] Dispatching Web Push to user ${userId}: ${title}`);
    }

    return payload;
  }
}
