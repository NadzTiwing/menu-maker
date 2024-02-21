import { ReactElement, useState } from "react";
import {
  Typography,
  Grid,
  Box,
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
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { ArrowDropDown } from "@mui/icons-material";
import { generateId } from "../utils";
import { ICategory, IAmount, IItemOptions } from "../types";

const categories: readonly ICategory[] = [
  { id: "option-1", name: "Snacks" },
  { id: "option-2", name: "Meal" },
  { id: "option-3", name: "Drinks" },
];

const filter = createFilterOptions<ICategory>();

const AddItem: React.FC = (): ReactElement => {
  const [category, setCategory] = useState<ICategory | null>(null);
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<IAmount>({ cost: 0, stock: 0 });
  const [hasOptions, setHasOptions] = useState<boolean>(false);
  const [options, setOptions] = useState<IItemOptions[]>([]);

  // const handleChangeAmt = (value, type) => {
  //   setAmount((obj: IAmount) => {
  //     if (keyof obj === )
  //   })
  // }

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
        <Grid container direction="column" spacing={2}>
          <Grid item container direction="row" spacing={2}>
            <Grid item>
              <Autocomplete
                value={category}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    setCategory({
                      id: generateId(),
                      name: newValue,
                    });
                  } else if (newValue && newValue.name) {
                    setCategory({
                      id: generateId(),
                      name: newValue.name,
                    });
                  } else {
                    setCategory(newValue);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.name
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      id: generateId(),
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
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Select or Enter Category" />
                )}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(event) => setName(event.target.value)}
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
                    onChange={(event) => setHasOptions(event.target.checked)}
                    />
                    }
                    label="With options:"
                    labelPlacement="start"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item>
              {hasOptions && <Button variant="contained" size="small">Add Option</Button> }
            </Grid>
          </Grid>
          {hasOptions ?
          <Grid item container direction="row" spacing={2} alignItems="center">
            <Grid item>
              asd
            </Grid>
          </Grid>
          :
          <Grid item container direction="row" spacing={2} alignItems="center">
            <Grid item>
              <TextField
                label="Cost"
                variant="outlined"
                value={amount.cost}
                type="number"
                inputProps={{
                  min: 0,
                }}
                onChange={(event) => setAmount((prevAmt: IAmount) => ({
                  ...prevAmt,
                  cost: Number(event.target.value),
                }))}
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
                onChange={(event) => setAmount((prevAmt: IAmount) => ({
                  ...prevAmt,
                  stock: Number(event.target.value),
                }))}
              />
            </Grid>
          </Grid>
          }
          
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default AddItem;
