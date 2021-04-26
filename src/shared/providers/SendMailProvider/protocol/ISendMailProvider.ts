export interface ISendMail {
  to: {
    name: string;
    address: string;
  };
  from?: {
    name: string;
    address: string;
  };
  subject: string;
  variables: any;
  path: string;
}

export interface ISendMailProvider {
  sendMail({ to, subject, variables, path }: ISendMail): Promise<void>;
}
