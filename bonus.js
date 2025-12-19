// bonus.js

/**
 * حل مشكلة Majority Element
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
    let count = {};
    
    for (let num of nums) {
        count[num] = (count[num] || 0) + 1;
        if (count[num] > Math.floor(nums.length / 2)) {
            return num;
        }
    }
};

// أمثلة للتجربة
console.log(majorityElement([3,2,3])); // الناتج: 3
console.log(majorityElement([2,2,1,1,1,2,2])); // الناتج: 2
console.log(majorityElement([1])); // الناتج: 1
