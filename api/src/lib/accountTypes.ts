const accountTypes = {
  EMPLOYEE: "EMPLOYEE",
  CONSUMER: "CONSUMER",
} as const;

export type AccountType = (typeof accountTypes)[keyof typeof accountTypes];

export default accountTypes;
