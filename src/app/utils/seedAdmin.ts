/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { envVars } from "../configs/envConfig";
import { AuthProvider, IUser, UserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL as string,
    });
    if (isAdminExist) {
      console.log("Admin already exist!");
      return;
    }

    console.log("Trying to create admin...");

    const hashedPassword = await bcrypt.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND) | 10
    );

    const authProvider: AuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: IUser = {
      fullName: "Admin",
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      role: UserRole.ADMIN,
      auths: [authProvider],
    };

    const admin = await User.create(payload);

    console.log(`Admin created successfully.`);
    console.log(admin);
  } catch (error: any) {
    console.log(error);
  }
};
