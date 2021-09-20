import Lesson from "../src/models/lesson";
import Season from "../src/models/season";
import Topic from "../src/models/topic";
import Branch from "../src/models/branch";
import SubBranch from "../src/models/sub-branch";
import Group from "../src/models/group";
import SubGroup from "../src/models/sub-group";
import User from "../src/models/user";
import FiscalYear from "../src/models/fiscal-year";

export const subjectSeeder = async () => {
    try {
        let superAdmin = await User.findOne({
            firstName: "Super",
            lastName: "Admin",
            nationalCode: "1230012312",
        });
        let branch = await Branch.findOne({ title: "کسب و کار" });
        let subBranch = await SubBranch.findOne({ branch: branch._id });
        let group = await Group.findOne({ subBranch: subBranch._id });
        let subGroup = await SubGroup.findOne({ group: group._id });
        let fiscalYear = await FiscalYear.findOne({ title: 1400 });
        const lesson = {
            title: 'برنامه نویسی nodejs',
            branch: branch._id,
            subBranch: subBranch._id,
            group: group._id,
            subGroup: subGroup._id,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: null,
            user: superAdmin._id,
            fiscalYear: fiscalYear._id
        };
        let newLesson = await new Lesson(lesson);
        await newLesson.save();
        console.log("[seed]: Lesson seeded.");

        const season = {
            title: 'فصل اول: events',
            lesson: newLesson._id,
            user: superAdmin._id,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: null
        }

        let newSeason = await new Season(season);
        await newSeason.save();
        console.log("[seed]: Season seeded.");

        const topics = [{
                title: 'event loop',
                season: newSeason.id,
                user: superAdmin._id,
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'event listener',
                season: newSeason.id,
                user: superAdmin._id,
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },

        ];

        for (let topic of topics) {
            let newTopic = await new Topic(topic);
            await newTopic.save();
        }
        console.log("[seed]: Topic seeded.");

        console.log("Ready to use!")
            console.log("Enjoy!")

    } catch (err) {
        console.log("Error --> ", err)
        throw new Error("failed to seed database");
    }
}