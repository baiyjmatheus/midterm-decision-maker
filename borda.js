var descriptions = ['a', 'b', 'c'];

var data = [
  { description: 'a', rank: 1 },
  { description: 'b', rank: 2 },
  { description: 'c', rank: 3 },
  { description: 'a', rank: 3 },
  { description: 'b', rank: 1 },
  { description: 'c', rank: 2 },
  { description: 'a', rank: 3 },
  { description: 'b', rank: 1 },
  { description: 'c', rank: 2 }
];

var result = {};

// count scores
data.forEach((element) => {
  if (result[element.description]) {
    result[element.description] += element.rank + (descriptions.length - 1);
  } else {
    result[element.description] = element.rank + (descriptions.length - 1);
  }
});

console.log(result);

// a 5
// b 8
// c 5