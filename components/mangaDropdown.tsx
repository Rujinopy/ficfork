
export default function MangaDropdown({props}: any) { 
    return (
        <div className='w-1/4 pt-1 mb-5'>
                <label htmlFor="manga" className='block mb-2 text-sm font-medium
                 text-gray-900 dark:text-gray-400'>Select a manga</label>
                <select id="countries" className='bg-gray-50 border
                 border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-blue-500 focus:border-blue-500 block 
                  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                  dark:placeholder-gray-400 dark:text-white 
                  dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                  <option selected>Choose a manga</option>
                  <option value="reborn">reborn</option>
                  <option value="naruto">naruto</option>
                  <option value="FR">bleach</option>
                  <option value="DE">dragonball</option>
                </select>
        </div>
    )};