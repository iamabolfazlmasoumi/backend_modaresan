import bcrypt from "bcryptjs";
import Role from "../src/models/role";
import User from "../src/models/user";
import Department from "../src/models/department";
import Permission from "../src/models/permission";


export const roleSeeder = async () => {
    let permissionList = await Permission.find({}).exec();
        if (permissionList) {
            console.log("[seed]: Permissions seeded!");
        }
        let permissionArr = [];
        for (let permission of permissionList) {
            permissionArr.push(permission._id);
        }
        if (permissionArr.length === permissionList.length) {
            console.log("[seed]: permissionArr constructed.");
        }

    let department = await Department.findOne({
        code: "0001"
    }).exec();


    if (department != null) {
        let newRole = await new Role({
            title: "SuperAdmin",
            permissions: permissionArr,
            groups: [],
            cities: [],
            department: department._id,
            createdAt: Date.now(),
            updatedAt: null,
            isDeleted: false,
        });
        await newRole.save();
        console.log("[seed]: Role seeded.");
    } else {
        console.log("department not found");
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt);

    let role = await Role.findOne({
        title: "SuperAdmin"
    }).exec();

    if (role) {
        let newUser = await new User({
            firstName: "Super",
            lastName: "Admin",
            mobile: "09909628600",
            nationalCode: "1230012312",
            password: hash,
            role: role._id,
            isActivated: true,
            createdAt: Date.now(),
        });
        await newUser.save();
        let user = await User.findOne({
            mobile: "09909628600"
        });
        if (user) {
            console.log("[seed]: SuperAdmin user created and SuperAdmin role has been assigned to the user :)");
        }

    } else {
        console.log("ROLE not found");
    }
}