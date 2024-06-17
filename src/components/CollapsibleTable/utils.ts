// ----------------------------------------------------------------------

export default function createData(name: string, calories: number, fat: number, carbs: number) {
  return {
    name,
    calories,
    fat,
    carbs,
    history: [
      {
        date: '2024-06-12',
        txc: 'ToVPDrBvSUFrdZasJrz9EXmdENBrt2g3bb',
        hashPower: 500,
        reward: 3800,
        sharePercent: '20%',
      },
      {
        date: '2024-06-12',
        txc: 'TuUhDsV4mw2V65ujSQwfboy27odR3EMQRT',
        hashPower: 500,
        reward: 3800,
        sharePercent: '20%',
      },
    ],
  };
}
