import { ReactElement, useEffect, useState } from "react";
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { ICategory, ICategoriesSelection } from "../types";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

const filter = createFilterOptions<ICategory>();

const CategoriesSelection: React.FC<ICategoriesSelection> = ({
  category,
  handleSelect,
}: ICategoriesSelection): ReactElement => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const categoriesRef = ref(db, "categories/");
  useEffect(() => {
    onValue(categoriesRef, (snapshot) => {
      const categoriesObj = snapshot.val() || {};
      const categoriesArray = Object.keys(categoriesObj).map((key) => ({
        id: key,
        ...categoriesObj[key],
      }));
      setCategories(categoriesArray);
    });

  }, []);

  return (
    <Autocomplete
      value={category}
      onChange={(_event, newValue) => {
        handleSelect(newValue as ICategory);
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            id: "new-category",
            name: inputValue,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={categories}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.name) {
          return option.name;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Select or Enter Category" required />
      )}
    />
  );
};

export default CategoriesSelection;
