#island

## Using http://cjanssen.bitbucket.org/themegen/, it generated "island", I immediately envisioned an ASCII island survival game in the style of Dwarf Fortress, but on an island.

1,048,576 different islands.


Coconut 1400cals
30 per year.

When cold, it requires twice the amount of calories.

1250 min
2500 avg
5000 max - diarrhea

If a player lands on an island with another player, the other player eats them and gets a caloric bonus.

Plants
+ Grass
+ Yams
- Taro

Trees & Saplings
+ Coconuts
- Palm
- Tapa

+ Rats
- Chickens

+ Fish from ocean

+ Rocks


Food
Expired food has a half chance to get sick
Coconuts - year / 1400 calories
fish - 144 calories
  raw - expired / 100 calories
  cooked - good for one day / 150 calories
- rats -
  raw - 100% chance sick / 500 calories
  cooked - 650 calories
yams
  raw - poison
  cooked  - 150 calories

Fire
  two rocks together
  lightning

Water
  fresh water source - one drink of water
  one coconut will replenish water content

Implement Island Generation
num of island squares =  sqrt(1,048,576)
num of fresh water squares = 2% of island squares
num of trees  = 15% of island (10-50% of trees are saplings)
num of plants = 30% of island (90-95% grass / remainder Yams)

Implement Player
Movement - movement slows at lower health
Health - 100 points
Thirst - 24 hours / ~48 hours to die or every 30 mins 1 health point
  Drink fresh water.
  Drink coconut water.
Hunger - 24 hours / ~2 weeks to die or every 4 hours 1 health point
  Eat coconut

Implement Fire
Make a fire with two stones.
Keep fire burning.
