"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updated = exports.one = exports.getall = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Jwt_1 = require("../helpers/secure/Jwt");
const prisma = new client_1.PrismaClient();
// regiateraion
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password, phone, role } = req.body;
        if (!email || !name || !password || !phone || !role) {
            return res.status(400).json({
                isSuccess: false,
                message: "Please provide info",
            });
        }
        //checking email
        const useremail = yield prisma.user.findFirst({
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
        const hashpass = bcryptjs_1.default.hashSync(password);
        const newuser = yield prisma.user.create({
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
            result: Object.assign({}, newuser),
        });
    }
    catch (error) {
        console.log(error);
        res.json(error);
    }
});
exports.register = register;
//login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                isSuccess: false,
                message: "Pleaser set info",
            });
        }
        const user = yield prisma.user.findFirst({
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
        const dehashpass = bcryptjs_1.default.compareSync(password, user.password);
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
            token: (0, Jwt_1.generateToken)({
                Userid: user.Userid,
                email: user.email,
                role: user.role,
            }),
        };
        res.json({
            result: Object.assign({}, result),
            isSuccess: true,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.login = login;
//    get all users
const getall = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const alluser = yield prisma.user.findMany({
        orderBy: {
            Userid: "desc",
        },
    });
    res.json({
        result: [...alluser],
    });
});
exports.getall = getall;
//  get one user
const one = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Userid } = req.params;
        const oneuser = yield prisma.user.findFirst({
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
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.one = one;
//    update  the  user
const updated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone } = req.body;
        const { id } = req.params;
        if (!name || !phone) {
            res.status(400).json({
                massage: " your info is missing ",
                isSucsess: false,
            });
        }
        const checking = yield prisma.user.findFirst({
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
        const updateuser = yield prisma.user.update({
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
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.updated = updated;
