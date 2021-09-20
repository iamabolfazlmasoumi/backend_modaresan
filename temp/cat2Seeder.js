import Branch from "../src/models/branch";
import SubBranch from "../src/models/sub-branch";
import Group from "../src/models/group";
import SubGroup from "../src/models/sub-group";

export const cat2Seeder = async () => {
    try {

        const branch = {
            title: 'کسب و کار',
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: null
        };
        let newBranch = await new Branch(branch);
        await newBranch.save();
        console.log("[seed]: Branch seeded.");

        const subBranch = {
            title: 'برنامه نویسی',
            branch: newBranch._id,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: null
        }

        let newSubBranch = await new SubBranch(subBranch);
        await newSubBranch.save();
        console.log("[seed]: SubBranch seeded.");

        const group = {
            title: 'برنامه نویسی وب',
            subBranch: newSubBranch._id,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: null
        }
        let newGroup = await new Group(group);
        await newGroup.save();
        console.log("[seed]: Group seeded.");

        const subGroups = [{
                title: 'نود جی اس',
                group: newGroup.id,
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'ری اکت جی اس',
                group: newGroup._id,
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },

        ];

        for (let subGroup of subGroups) {
            let newSubGroup = await new SubGroup(subGroup);
            await newSubGroup.save();
        }
        console.log("[seed]: SubGroup seeded.");

    } catch (err) {
        console.log("Error --> ", err)
        throw new Error("failed to seed database");
    }
}