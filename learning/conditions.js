/*//Defining a condition class that represents the starting point for our 6 conditions.
class condition{
  constructor(number, count){
    this.number=number;
    this.count=count;
  }
}

//Constructing the 6 different conditions as objects, each with 2 attributes.
//The "number" attribute represents the condition itself and the "count" attribute
//keeps track of how many participants have been assigned to that partiuclat condtion.
let condition1 = new condition(1, 0);
let condition2 = new condition(2, 0);
let condition3 = new condition(3, 0);
let condition4 = new condition(4, 0);
let condition5 = new condition(5, 0);
let condition6 = new condition(6, 0);

//Creating an array with the 6 conditions and their attributes (objects).
arr_of_cond = [condition1, condition2, condition3, condition4, condition5, condition6];

//The function creates a random integer between 1 and 6 and increases the count of the resulting condition
  function generate_random_condition () {
    let index = Math.floor(Math.random()*arr_of_cond.length);
    let cond = arr_of_cond[index];
    arr_of_cond[index].count++;
    test(index);
    console.log(index);
    console.log(cond);
    console.log(arr_of_cond);
  }

  function test(index0){
  if (arr_of_cond[index0].count === 2){
    if (arr_of_cond.length === 1) {
      console.log ("redirect participant to page and then take down the homepage");
    } else {
     console.log ("redirect last participant to page");
     arr_of_cond.splice(index0, 1);}
   }
 else {console.log("redirect next participant to page");}
   }


generate_random_condition ();
generate_random_condition ();
generate_random_condition ();
generate_random_condition ();
generate_random_condition ();
generate_random_condition ();
generate_random_condition ();
generate_random_condition ();
generate_random_condition ();
generate_random_condition ();
generate_random_condition ();
generate_random_condition ();


//redirect to page + create file for participant with unique identifier
*/

let arr = new Array(6);
x = Math.floor(Math.random()*6);
arr[x] = 0;

for (let i=0, i<arr.length, i++) {
  if (arr[i]==undefined){
    arr[i]=Math.floor(Math.random()*40 + 1);}
  };}
