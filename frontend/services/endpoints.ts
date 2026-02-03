export const endpoints = {
  predict: (symbol: string, model: string) =>
    `/model/predict?symbol=${symbol}&model=${model}`,
};
