export type DonationEntity = {
  date: Date;
  amount: number;
};

export type Sex = "male" | "female";

export type VolonteerEntity = {
  id: string;
  avatar: string;
  firstName: string;
  secondName: string;
  phone: string;
  address: string;
  country: string;
  sex: Sex;
  age: number;
  donation: DonationEntity[];
  isHasDriverLicence: Boolean;
  isHasMedicalExperience: Boolean;
  isHasAnimalRescueExperience: Boolean;
  isHasVetExperience: Boolean;
  isHasPsychologicalExperience: Boolean;
  isAvailable: Boolean;
  isSelected: Boolean;
};

export type Volonteers = VolonteerEntity[];
