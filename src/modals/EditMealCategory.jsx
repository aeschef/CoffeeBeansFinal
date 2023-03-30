import { useState, useEffect } from 'react'


// Ref to firebase reports collection
const categories = ["breakfast", "lunch", "dinner"]


const EditMealCategory = ({ open, onClose, mealCategory, updateMealCategory, quota, setQuota }) => {
    if (!open) return null

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

                  <button>Choose from Recipe</button>
                  <button>Choose from Ingredients</button>
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
                          onChange={(e) => setQuota(e.target.value)}
                          value={quota}
                          />
                      </div>
                      <button type="submit">Update category</button>
                    </form>              

              </div>
          </div>
      </div>
    </div>
      
    )

}

export default EditMealCategory