
const firebaseConfig = {
  apiKey: "AIzaSyCJ_q627N1dryTYbcSjE4d-4jfsJJg5VcY",
  authDomain: "park-burlington.firebaseapp.com",
  databaseURL: "https://park-burlington.firebaseio.com",
  projectId: "park-burlington",
  storageBucket: "park-burlington.appspot.com",
  messagingSenderId: "474825299090",
  appId: "1:474825299090:web:d06b7eb22ba0309571c24b",
  measurementId: "G-HDKTL5YR29"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database()
const ref = database.ref()
let data;
fetch("./BurlingtonParkingMap.geojson")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    

    for ( let i = 0; i<=12; i++){
      
      
       //let usersRef =ref.child(2);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=Parking%2C%20147%20Cherry%20St%2C%20Burlington%2C%20VT%2005401"}) 
      // console.log('added' )

       //let usersRef =ref.child(3);
      // usersRef.update({ 
      // navigationURL: " https://www.google.com/maps/dir/?api=1&destination=44.474686%2C%20-73.213503"}) 
      // console.log('added' )

       //let usersRef =ref.child(4);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=City%20Park%20Burlington%2C%20Burlington%2C%20VT%2005401"}) 
      // console.log('added' )

       //let usersRef =ref.child(5);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=44.477999%2C%20-73.209363"}) 
      // console.log('added' )

       //let usersRef =ref.child(6);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=Lakeview%20Garage%20(Cherry%20St)%2C%2045%20Cherry%20St%2C%20Burlington%2C%20VT%2005401"}) 
      // console.log('added' )

       //let usersRef =ref.child(7);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=Lakeview%20Garage%20(Cherry%20St)%2C%2045%20Cherry%20St%2C%20Burlington%2C%20VT%2005401"}) 
      // console.log('added' )

       //let usersRef =ref.child(8);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=Lakeview%20Garage%20(Cherry%20St)%2C%2045%20Cherry%20St%2C%20Burlington%2C%20VT%2005401"}) 
      // console.log('added' )

       //let usersRef =ref.child(9);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=Lakeview%20Garage%20(Cherry%20St)%2C%2045%20Cherry%20St%2C%20Burlington%2C%20VT%2005401"}) 
      // console.log('added' )

       //let usersRef =ref.child(10);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=Lakeview%20Garage%20(Cherry%20St)%2C%2045%20Cherry%20St%2C%20Burlington%2C%20VT%2005401"}) 
      // console.log('added' )

       //let usersRef =ref.child(2);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=Lakeview%20Garage%20(Cherry%20St)%2C%2045%20Cherry%20St%2C%20Burlington%2C%20VT%2005401"}) 
      // console.log('added' )

       //let usersRef =ref.child(2);
      // usersRef.update({ 
      // navigationURL: "https://www.google.com/maps/dir/?api=1&destination=Lakeview%20Garage%20(Cherry%20St)%2C%2045%20Cherry%20St%2C%20Burlington%2C%20VT%2005401"}) 
      // console.log('added' )
    }
















    // for (let i = 5; i < 248 ; i++) {
    //   let desc = data.features[i].properties.description
    //   let firstChar = desc.charAt(0)
    //   if (firstChar === '<') {
    //     let newObj ={}
    //     let sliceOne = desc.slice(desc.indexOf('<br><br>') + 8)
    //     let sliceTwo = sliceOne.slice(0, sliceOne.indexOf('<br><br>'))
    //     let sliceThree = sliceTwo.split('<br>')
    //     sliceThree.forEach(item => {
    //       let test2 = item.split(':')
    //       console.log(test2)
    //       newObj[test2[0]] = test2[1]
    //       let usersRef = ref.child(i);
    //       usersRef.set({newObj})
    //     })
    //   }
    //   else {
    //     let newObj = {}
    //     let splitDescArray = desc.split('<br>')
    //     splitDescArray.forEach(item => {
    //       let test2 = item.split(':').trim
    //       newObj[test2[0]] = test2[1]
    //       let usersRef = ref.child(i);
    //       usersRef.set({newObj})
    //     })
        

    //   } // end of the else
   // } // end of the for loop
  }) // end of the then

/*
let foo = data.split("\n").reduce(function(obj, str, index) {
  let strParts = str.split(":");
  if (strParts[0] && strParts[1]) { //<-- Make sure the key & value are not undefined
    obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); //<-- Get rid of extra spaces at beginning of value strings
  }
  return obj;
}, {});

console.log(foo); */
