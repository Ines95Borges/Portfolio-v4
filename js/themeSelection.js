export let primary_30 = 'hsl(225, 100%, 30%)';
export let primary_50 = 'hsl(225, 100%, 50%)';
export let primary_70 = 'hsl(225, 100%, 70%)';

export let neutral_10 = 'hsl(0, 0%, 10%)';
export let neutral_45 = 'hsl(0, 0%, 45%)';
export let neutral_90 = 'hsl(0, 0%, 90%)';

let turn = 0;
const toggleThemeButton = document.querySelector('.toggleThemeButton');

toggleThemeButton.addEventListener('click', () => {
  let temp = primary_30;
  primary_30 = primary_70;
  primary_70 = temp;

  let temp2 = neutral_10;
  neutral_10 = neutral_90;
  neutral_90 = temp2;

  turn++;
});