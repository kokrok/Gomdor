export function valueOfPrimeFactors(n){
    let valueOfPrimeFactors = 0;
    let initail_n = n;
    let smallest_PrimeFactors = 2;
    let smallest_PrimeFactors_index = 0;
    for(let i=0; i<initail_n; i++){
      if(n<smallest_PrimeFactors)continue;
      if(n%smallest_PrimeFactors==0){
        console.log("n1",n);
        console.log("smallest_PrimeFactors",smallest_PrimeFactors_index,smallest_PrimeFactors);
        n=n/smallest_PrimeFactors;      
        console.log("n2",n);
        valueOfPrimeFactors++;
        console.log(valueOfPrimeFactors);
      }
      else{
        console.log("s",smallest_PrimeFactors_index,smallest_PrimeFactors);
        smallest_PrimeFactors++;
        smallest_PrimeFactors_index++;
        console.log("s",smallest_PrimeFactors_index,smallest_PrimeFactors);
      }
    }
    return valueOfPrimeFactors;
  }
 export function valueOfPrimeFactor(n,ii){
    let valueOfPrimeFactors = 0;
    let initail_n = n;
    let smallest_PrimeFactors = 2;
    let smallest_PrimeFactors_index = 1;
    for(let i=0; i<initail_n; i++){
      if(n<smallest_PrimeFactors)continue;
      if(n%smallest_PrimeFactors==0){
        //console.log("n1",n);
        //console.log("smallest_PrimeFactors",smallest_PrimeFactors_index,smallest_PrimeFactors);
        n=n/smallest_PrimeFactors;      
        //console.log("n2",n);
        valueOfPrimeFactors++;
        //console.log(valueOfPrimeFactors);
      }
      else{
        //console.log("s",smallest_PrimeFactors_index,smallest_PrimeFactors);
        smallest_PrimeFactors++;
        smallest_PrimeFactors_index++;
        //console.log("s",smallest_PrimeFactors_index,smallest_PrimeFactors);
      }
    }
  }
  export function isPrime(n){
    const n_string = (n).toString();
    valueOfTrueFalse = 0;
    valueOfDivisors = 0;
    if(n<2)return 2;
    let i=0;
  
    for(i=2; i<n; i++){
      if(n%i==0)valueOfDivisors++;
    }
    if(valueOfDivisors!=0){
      valueOfTrueFalse=0;
      //console.log(n_string, "is not Prime");
    }
    else{
      valueOfTrueFalse=1;
      //console.log(n_string, "is Prime");
    }
    //console.log("valueOfDivisors:",valueOfDivisors);
    //console.log("valueOfTrueFalse:",valueOfTrueFalse);
    
    return valueOfTrueFalse;
  }
//export {valueOfPrimeFactors, valueOfPrimeFactor, isPrime};