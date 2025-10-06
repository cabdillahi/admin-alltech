import { PrismaClient } from "@prisma/client";
import bcryp from "bcryptjs";
import { Request } from "express";
import {  CustomUserRequest, generateToken } from "../helpers/secure/Jwt";
const prisma = new PrismaClient();

//interface userregister
interface registeration {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}
// regiateraion

export const register = async (req: CustomUserRequest, res: any) => {
  try {
    const { email, name, password, phone, role } = req.body as registeration;

    if (!email || !name || !password || !phone || !role) {
      return res.status(400).json({
        isSuccess: false,
        message: "Please provide info",
      });
    }

    //checking email

    const useremail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (useremail) {
      return res.status(400).json({
        isSuccess: false,
        message: "email is already used",
      });
    }

    //hashpass

    const hashpass = bcryp.hashSync(password);



    const newuser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashpass,
        phone,
        role: req.body.role,
      },
      select: {
        Userid: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res.json({
      isSuccess: true,
      result: { ...newuser },
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//login

export const login = async (req: CustomUserRequest, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        isSuccess: false,
        message: "Pleaser set info",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "invalid info...",
        isSuccess: false,
      });
    }

    //dehashpass
    const dehashpass = bcryp.compareSync(password, user.password);

    if (!dehashpass) {
      return res.status(400).json({
        isSuccess: false,
        message: "invalid info...",
      });
    }

    const result = {
      email: user.email,
      name: user.name,
      Role: user.role,
      phone: user.phone,
      token: generateToken({
        Userid: user.Userid,
        email: user.email,
        role: user.role,
      }),
    };
    res.json({
      result: { ...result },
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//    get all users
export const getall = async (req: CustomUserRequest, res: any) => {
  const alluser = await prisma.user.findMany({
    orderBy: {
      Userid: "desc",
    },
  });
  res.json({
    result: [...alluser],
  });
};

//  get one user

export const one = async (req: CustomUserRequest, res: any) => {
  try {
    const { Userid } = req.params;
    const oneuser = await prisma.user.findFirst({
      where: {
        Userid: +Userid,
      },
    });

    if (!oneuser) {
      return res.status(400).json({
        message: `your ${Userid} is not axist`,
        isSuccess: false,
      });
    }

    res.json({
      oneuser,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//    update  the  user

export const updated = async (req: CustomUserRequest, res: any) => {
  try {
    const { name, phone } = req.body;
    const { id } = req.params;

    if (!name || !phone) {
      res.status(400).json({
        massage: " your info is missing ",
        isSucsess: false,
      });
    }

    const checking = await prisma.user.findFirst({
      where: {
        Userid: +id,
      },
    });

    if (!checking) {
      return res.status(400).json({
        message: "user is not axist",
        isSuccess: false,
      });
    }

    const updateuser = await prisma.user.update({
      where: {
        Userid: +id,
      },
      data: {
        name,
        phone,
      },
    });
    res.json({
      isSuccess: true,
      updateuser,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};