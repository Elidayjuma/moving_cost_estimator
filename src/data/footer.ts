import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading: "Empowering logistics businesses beyond imagination.",
    quickLinks: [
        {
            text: "Drivers",
            url: "https://forms.gle/k7H6yVxMWx8bgmdX9"
        },
        {
            text: "Moving Services",
            url: "https://tosomewherelogistics.africa/category/moving-services/"
        },
        {
            text: "Get Quote",
            url: "https://forms.gle/b2dcDzowBEd1BmoV9"
        },
    ],
    email: 'tosomewherelogistics@gmail.com',
    telephone: 'not today',
    socials: {
        // github: 'https://github.com',
        // x: 'https://twitter.com/x',
        twitter: 'https://x.com/sumwealogistics',
        facebook: 'https://facebook.com',
        // youtube: 'https://youtube.com',
        linkedin: 'https://www.linkedin.com',
        // threads: 'https://www.threads.net',
        instagram: 'https://www.instagram.com',
    }
}