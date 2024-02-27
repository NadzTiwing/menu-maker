import { ReactElement, useState } from "react";
import { db } from "../firebase";
import { ref, push, set } from "firebase/database";
import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Switch,
  FormGroup,
  FormControlLabel,
  FormControl,
  Button,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { generateId } from "../utils";
import { ICategory, IAmount, IItemOption } from "../types";
import ItemOptions from "./ItemOptions";
import PopupMessage from "./PopupMessage";
import CategoriesSelection from "./CategoriesSelection";

const AddItem: React.FC = (): ReactElement => {
  const [category, setCategory] = useState<ICategory | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<IAmount>({ price: 0, cost: 0, stock: 0 });
  const [hasOptions, setHasOptions] = useState<boolean>(false);
  const [options, setOptions] = useState<IItemOption[]>([
    { id: "item-option-1", name: "", price: 0, cost: 0, stock: 0 },
  ]);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleShowAlert = () => {
    setOpenAlert(!openAlert);
  };

  const handleSelectCategory = (newValue: ICategory) => {
    if (typeof newValue === "string") {
      setCategory({
        id: "new-category",
        name: newValue,
      });
    } else if (newValue && newValue.name) {
      setCategory({
        id: newValue.id,
        name: newValue.name,
      });
    } else {
      setCategory(newValue);
    }
  };

  const handleAddOption = () => {
    const newOption = {
      id: generateId(),
      name: "",
      price: 0,
      cost: 0,
      stock: 0,
    };
    setOptions((prevOptions: IItemOption[]) => [...prevOptions, newOption]);
  };

  const handleChange = (id: string, obj: string, value: string | number) => {
    setOptions((prevOptions: IItemOption[]) => {
      return prevOptions.map((prevOption: IItemOption) => {
        if (prevOption.id === id) {
          return {
            ...prevOption,
            [obj]: value,
          };
        }
        return prevOption;
      });
    });
  };

  const handleRemove = (id: string) => {
    const udpateOptions = options.filter((item: IItemOption) => item.id !== id);
    setOptions(udpateOptions);
  };

  const addNewCategory = (name: string): string => {
    let categoryId: string = "";

    const categoryRef = push(ref(db, "categories"));
    set(categoryRef, {
      name,
    })
      .then(() => {
        categoryId = categoryRef.key || "";
      })
      .catch((error) => {
        console.error("Error adding an item: ", error);
      });

    return categoryId;
  };

  const handleAddItem = async () => {
    if (!name || !category) {
      setOpenAlert(true);
      setMessage("Enter the required fields");
      return;
    }

    // check and save entered category
    if (categories.length > 0) {
      const isCategoryExists = categories.some(
        (item: ICategory) =>
          item.name.toLowerCase() === category.name.toLowerCase()
      );
      if (!isCategoryExists) {
        categories.push(category);
        setCategories(categories);
      }
    }

    const newItemRef = push(ref(db, "items"));
    if (hasOptions) {
      const hasEmptyString = options.some((option) => option.name === "");
      if (options.length === 0 || hasEmptyString) {
        setOpenAlert(true);
        setMessage("Add an option");
        return;
      }

      const newItem = {
        categoryId: category.id,
        name,
        options,
      };

      if (newItem.categoryId === "new-category") {
        newItem.categoryId = addNewCategory(category.name);
        set(newItemRef, newItem );
      } else set(newItemRef, newItem );
    } else {
      const newItem = {
        categoryId: category.id,
        name,
        price: amount.price,
        cost: amount.cost,
        stock: amount.stock,
      };

      if (newItem.categoryId === "new-category") {
        newItem.categoryId = addNewCategory(category.name);
        set(newItemRef, newItem);
      } else set(newItemRef, newItem);
    }

    setName("");
    setCategory(null);
    setAmount((amt) => ({ ...amt, price: 0, cost: 0, stock: 0 }));
    setOptions([]);

    setOpenAlert(true);
    setMessage("Successfully added!");
  };


  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDropDown className="text-primary" />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography className="text-primary" sx={{ fontWeight: "bold" }}>
          Add Item (+)
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <PopupMessage
          isOpen={openAlert}
          handleShow={handleShowAlert}
          message={message}
        />
        <Grid container direction="column" spacing={2}>
          <Grid item container direction="row" spacing={2}>
            <Grid item>
              <CategoriesSelection
                category={category}
                handleSelect={handleSelectCategory}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Grid>
          </Grid>
          <Grid item container direction="row" spacing={2} alignItems="center">
            <Grid item>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    value={hasOptions}
                    control={
                      <Switch
                        color="success"
                        checked={hasOptions}
                        onChange={(event) =>
                          setHasOptions(event.target.checked)
                        }
                      />
                    }
                    label="With options:"
                    labelPlacement="start"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
          {hasOptions ? (
            <Grid container item direction="column" gap={2}>
              {options.map((item: IItemOption, index: number) => (
                <ItemOptions
                  key={item.id}
                  index={index}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  cost={item.cost}
                  stock={item.stock}
                  handleChange={handleChange}
                  handleRemove={handleRemove}
                />
              ))}
              <Grid item>
                {hasOptions && (
                  <Button
                    variant="outlined"
                    size="large"
                    color="success"
                    onClick={() => handleAddOption()}
                    fullWidth
                  >
                    Add New Option
                  </Button>
                )}
              </Grid>
            </Grid>
          ) : (
            <Grid
              item
              container
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Grid item>
                <TextField
                  label="Price"
                  variant="outlined"
                  value={amount.price}
                  type="number"
                  inputProps={{
                    min: 0,
                  }}
                  onChange={(event) =>
                    setAmount((prevAmt: IAmount) => ({
                      ...prevAmt,
                      price: Number(event.target.value),
                    }))
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Cost"
                  variant="outlined"
                  value={amount.cost}
                  type="number"
                  inputProps={{
                    min: 0,
                  }}
                  onChange={(event) =>
                    setAmount((prevAmt: IAmount) => ({
                      ...prevAmt,
                      cost: Number(event.target.value),
                    }))
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Amount in Stock"
                  variant="outlined"
                  value={amount.stock}
                  type="number"
                  inputProps={{
                    min: 0,
                  }}
                  onChange={(event) =>
                    setAmount((prevAmt: IAmount) => ({
                      ...prevAmt,
                      stock: Number(event.target.value),
                    }))
                  }
                />
              </Grid>
            </Grid>
          )}
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleAddItem()}
            >
              INSERT
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default AddItem;
