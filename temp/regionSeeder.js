import Country from "../src/models/country";
import Province from "../src/models/province";
import City from "../src/models/city";

export const regionSeeder = async () => {
    try {

        const country = {
            title: 'ایران',
            phoneCode: 98,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: null
        };
        let newCountry = await new Country(country);
        await newCountry.save();
        console.log("[seed]: Country seeded.");

        const province = {
            title: 'تهران',
            country: newCountry._id,
            phoneCode: 21,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: null
        }

        let newProvince = await new Province(province);
        await newProvince.save();
        console.log("[seed]: Province seeded.");

        const cities = [{
                title: 'تهران',
                province: newProvince.id,
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'نسیم شهر',
                province: newProvince.id,
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },

        ];

        for (let city of cities) {
            let newCity = await new City(city);
            await newCity.save();
        }
        console.log("[seed]: City seeded.");

    } catch (err) {
        console.log("Error --> ", err)
        throw new Error("failed to seed database");
    }
}