import { useState, useEffect } from 'react'


// Ref to firebase reports collection
const categories = ["breakfast", "lunch", "dinner"]


const EditMealCategory = ({ open, onClose, prevMealCategory, quota, setQuota }) => {
    const [mealQuota, setMealQuota] = useState(0)
    const [mealCategory, updateMealCategory] = useState(prevMealCategory)
    useEffect(()=>{
      quota.map((item) => {
        if (item.id === mealCategory) {
          setMealQuota(item.quota)
        }})
      }, [])
  
    if (!open) return null
    


    const updateMeal = () => {
     // 1. Make a shallow copy of the items
     let quotas= [...quota];
      

     // 2. Make a shallow copy of the item you want to mutate
     
     let index = 0
     if (mealCategory===quotas[0].id)
       index = 0
     else if (mealCategory === quotas[1].id)
       index = 1
     else if (mealCategory === quotas[2].id)
       index = 2
     
     let item = {...quotas[index]};

     // 3. Replace the property you're intested in
      item.quota = mealQuota
      item.id = mealCategory
      // 4. Put it back into our array. N.B. we *are* mutating the array here, 
     //    but that's why we made a copy first
     quotas[index] = item;
      console.log(quotas)
     // 5. Set the state to our new copy
     //setQuota(quotas)
    }

    const handleQuotaChange = (newQuota) => {
      setMealQuota(newQuota)
 
    
    }

    return (
      <div>
        <div className="z-10 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
            <div onClick={onClose} className="flex overflow-y-auto justify-center items-center z-20 absolute top-0 left-0 w-full h-full">
                <div onClick={(e) => {e.stopPropagation()}} className="flex-col justify-center items-center bg-white w-6/12 h-auto rounded-2xl py-10 px-10">
                  <div className="flex justify-between w-full mb-5">
                      <button onClick={onClose} className="text-gray-800">
                          X
                      </button>
                  </div>

            
                  <form>
                    <div>
                      <h3>Category</h3>
                      <input 
                        id="category"
                        type="text"
                        placeholder="Category"
                        required
                        onChange={(e)=>updateMealCategory(e.target.value)}
                        value={mealCategory}
                      />
                      <h3>Quota</h3>
                      <input
                          id="meal"
                          type="text"
                          placeholder="Meal"
                          required
                          onChange={(e) => handleQuotaChange(e.target.value)}
                          value={mealQuota}
                          />
                      </div>
                      <button type="submit" onClick={updateMeal}>Update category</button>
                    </form>              

              </div>
          </div>
      </div>
    </div>
      
    )

}

export default EditMealCategory