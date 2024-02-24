import { Grid, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IItemOption } from "../types";

interface IItemProps extends IItemOption {
  handleChange: (id: string, type: string, value: string | number) => void;
  handleRemove: (id: string) => void;
}

const ItemOptions: React.FC<IItemProps> = ({
  id,
  name,
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
      <Grid item>
        <Button
          variant="text"
          sx={{ color: "lightgray", "&:hover": { color: "red" }  }}
          onClick={() => handleRemove(id)}
        >
          <CloseIcon />
        </Button>
      </Grid>
    </Grid>
  );
};

export default ItemOptions;
