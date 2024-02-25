import { useEffect, useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { IEditModal } from "../types";
import { ReactElement } from "react";
import { Grid, TextField, Button } from "@mui/material";
import { IItemWithOptions, IItemOption, ICategory } from "../types";
import CategoriesSelection from "./CategoriesSelection";
import ItemOptions from "./ItemOptions";
import { generateId } from "../utils";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "55vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditItemModal: React.FC<IEditModal> = ({
  isOpen,
  handleShow,
  details,
}: IEditModal): ReactElement => {
  const [itemName, setItemName] = useState<string>("");
  const [cost, setCost] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [options, setOptions] = useState<IItemOption[]>(
    (details as IItemWithOptions)?.options
  );
  const [category, setCategory] = useState<ICategory | undefined>(
    details?.category
  );

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

  const handleChangeOption = (
    id: string,
    obj: string,
    value: string | number
  ) => {
    if ((details as IItemWithOptions).options) {
      setOptions((prevOptions: any) => {
        return prevOptions?.map((prevOption: IItemOption) => {
          if (prevOption.id === id) {
            return {
              ...prevOption,
              [obj]: value,
            };
          }
          return prevOption;
        });
      });
    }
  };

  const handleRemoveOption = (id: string) => {
    const udpateOptions = options?.filter(
      (item: IItemOption) => item.id !== id
    );

    setOptions(udpateOptions);
  };

  const handleSave = async () => {
    let udpatedData =
      options?.length > 0
        ? {
            name: itemName,
            categoryId: category?.id,
            options: options,
          }
        : {
            name: itemName,
            categoryId: category?.id,
            cost: cost,
            stock: stock,
          };

    if (details?.id) {
      const docRef = doc(db, "items", details.id);
      updateDoc(docRef, udpatedData);
    }
    
    // hide modal
    handleShow();
  };

  const handleAddOption = () => {
    const newOption = {
      id: generateId(),
      name: "",
      cost: 0,
      stock: 0,
    };
    setOptions((prevOptions: IItemOption[]) => [...prevOptions, newOption]);
  };

  useEffect(() => {
    const itemOptions = (details as IItemWithOptions)?.options;
    setItemName(details?.name || "");
    setCategory(details?.category);
    setCost(details?.cost || 0);
    setStock(details?.stock || 0);
    setOptions(itemOptions);
  }, [details]);
  return (
    <Modal
      open={isOpen}
      onClose={handleShow}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container direction="column" gap={1}>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
            />
            <CategoriesSelection
              category={category || null}
              handleSelect={handleSelectCategory}
            />
          </Grid>
          {(details as IItemWithOptions)?.options ? (
            <Grid container item direction="column" gap={2}>
              {options?.map((option, index) => (
                <ItemOptions
                  key={option.id}
                  index={index}
                  id={option.id}
                  name={option.name}
                  cost={option.cost}
                  stock={option.stock}
                  handleChange={handleChangeOption}
                  handleRemove={handleRemoveOption}
                />
              ))}
              <Grid item>
                <Button
                  variant="outlined"
                  size="large"
                  color="success"
                  onClick={() => handleAddOption()}
                  fullWidth
                >
                  Add New Option
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid
              item
              container
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <TextField
                id="outlined-basic"
                label="Cost"
                variant="outlined"
                type="number"
                inputProps={{
                  min: 0,
                }}
                value={cost}
                onChange={(event) => setCost(Number(event.target.value))}
              />
              <TextField
                id="outlined-basic"
                label="Amount in stock"
                variant="outlined"
                type="number"
                inputProps={{
                  min: 0,
                }}
                value={stock}
                onChange={(event) => setStock(Number(event.target.value))}
              />
            </Grid>
          )}

          <Grid
            item
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item>
              <Button variant="contained" onClick={() => handleSave()}>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{ color: "lightgray", "&:hover": { color: "gray" } }}
                onClick={() => handleShow()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditItemModal;
