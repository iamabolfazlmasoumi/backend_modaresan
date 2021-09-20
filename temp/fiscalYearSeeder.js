import FiscalYear from "../src/models/fiscal-year";


export const fiscalYearSeeder = async () => {
    try {

        const fiscalYears = [{
            title: 1399,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: null
        },
        {
            title: 1400,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: null
        }];
        

        for (let fiscalYear of fiscalYears) {
            let newFiscalYear = await new FiscalYear(fiscalYear);
            await newFiscalYear.save();
        }
        console.log("[seed]: FiscalYear seeded.");

    } catch (err) {
        console.log("Error --> ", err)
        throw new Error("failed to seed database");
    }
}