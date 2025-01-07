export interface OnboardingData {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
}
const onboardingData: OnboardingData[] = [
  {
    id: 0,
    title: "Haasta.",
    description: "Vastaanota ystäväsi haasteet tai laita itse haaste menemään.",
    backgroundColor: "#FCF596",
  },
  {
    id: 1,
    title: "Voita.",
    description: "Näytä taitosi ja ansaitse kunniaa!",
    backgroundColor: "#C2FFC7",
  },
  {
    id: 2,
    title: "Träkkää.",
    description: "Tuuriako? Anna tilastojen puhua puolestasi",
    backgroundColor: "#FFF1DB",
  },
];
export default onboardingData;
