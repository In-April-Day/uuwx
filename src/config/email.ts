import emailjs from "@emailjs/browser";

interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export const emailConfig: EmailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
};

export const initEmailJS = () => {
  if (emailConfig.publicKey) {
    emailjs.init(emailConfig.publicKey);
  }
};

export const isEmailConfigValid = () => {
  return !!(
    emailConfig.serviceId &&
    emailConfig.templateId &&
    emailConfig.publicKey
  );
};
