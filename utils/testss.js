const items = [1,2,3,4,5,6,7,1,2,3,5]

const filteredItems = [...new Set(items)]
// filteredItems.forEach(item => {
//     console.log(item)
// })

console.log(filteredItems.length)