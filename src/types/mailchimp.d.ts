declare module '@mailchimp/mailchimp_marketing' {
  interface MailchimpConfig {
    apiKey: string;
    server: string;
  }

  interface MailchimpListMember {
    email_address: string;
    status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'transactional';
    [key: string]: astring | number | boolean | null | undefined;
  }

  interface MailchimpLists {
    addListMember(listId: string, data: MailchimpListMember): Promise<undefined>;
  }

  interface Mailchimp {
    setConfig(config: MailchimpConfig): void;
    lists: MailchimpLists;
  }

  const mailchimp: Mailchimp;
  export default mailchimp;
}