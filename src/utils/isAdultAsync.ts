
export default function isAdultAsync(age: number, callback: (is: boolean) => void) {
  setTimeout(() => {
    if (age >= 18) {
      callback(true)
    } else {
      callback(false);
    }
  }, 1000);
}


