import { Grid, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IItemProps } from "../types";

const ItemOptions: React.FC<IItemProps> = ({
  index,
  id,
  name,
  price,
  cost,
  stock,
  handleChange,
  handleRemove,
}: IItemProps) => {
  return (
    <Grid
      key={`item-option${id}`}
      item
      container
      direction="row"
      spacing={2}
      alignItems="center"
    >
      <Grid item>
        <TextField
          label="Name of this Option"
          variant="outlined"
          value={name}
          type="text"
          onChange={(event) => handleChange(id, "name", event.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Price"
          variant="outlined"
          value={price}
          type="number"
          inputProps={{
            min: 0,
          }}
          onChange={(event) => handleChange(id, "price", Number(event.target.value))}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Cost"
          variant="outlined"
          value={cost}
          type="number"
          inputProps={{
            min: 0,
          }}
          onChange={(event) => handleChange(id, "cost", Number(event.target.value))}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Amount in Stock"
          variant="outlined"
          value={stock}
          type="number"
          inputProps={{
            min: 0,
          }}
          onChange={(event) => handleChange(id, "stock", Number(event.target.value))}
        />
      </Grid>
      {index != 0 && 
        <Grid item>
          <Button
            variant="text"
            sx={{ color: "lightgray", "&:hover": { color: "red" }  }}
            onClick={() => handleRemove(id)}
          >
            <CloseIcon />
          </Button>
        </Grid>
      }
    </Grid>
  );
};

export default ItemOptions;
