export default interface IConsumer {
  _id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  streetAddress: string;
  barangay: string;
  city: string;
  active: boolean;
}
