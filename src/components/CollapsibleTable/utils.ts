// ----------------------------------------------------------------------

export default function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  price: number
) {
  return {
    name,
    calories,
    fat,
    carbs,
    price,
    history: [
      {
        date: '2024-06-12',
        txc: '11091700',
        hashPower: 500,
        reward: 3800,
        sharePercent: '20%',
      },
      {
        date: '2024-06-12',
        txc: '11091700',
        hashPower: 500,
        reward: 3800,
        sharePercent: '20%',
      },
    ],
  };
}
