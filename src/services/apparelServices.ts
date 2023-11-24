import fs from "fs";
import path from "path";

// Note: Here we can create also create interfaces for the data models which are coming from the req.

const DATA_FILE_PATH = path.join(__dirname, "data.json");

// I have created the data format as following sample format.
// [
//     {
//         "code": "ABC123",
//         "sizes": {
//           "S": {
//             "quantity": 10,
//             "price": 20
//           },
//           "M": {
//             "quantity": 100,
//             "price": 100
//           },
//           "L": {
//             "quantity": 8,
//             "price": 30
//           }
//         }
//       },
// ]
interface Apparel {
  code: string;
  sizes: {
    [size: string]: {
      quantity: number;
      price: number;
    };
  };
}

/**
 * updateApparel for updating the current apparel.
 *  @returns success true or false
 */
export const apparelService = {
  updateApparel: (
    code: string,
    size: string,
    quantity: number,
    price: number
  ) => {
    try {
      let rawData: string;
      // try for reading the file.
      try {
        rawData = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      } catch (readError) {
        // Catching the case where the file doesn't exist or cannot be read
        console.error("Error reading file:", readError);
        return { success: false, message: "Error reading file." };
      }

      let data: Apparel[];
      try {
        // Attempt to parse JSON, or initialize with an empty array
        data = JSON.parse(rawData) || [];
      } catch (parseError) {
        // Handling when there is nothing in the data.json
        console.error("Error parsing JSON:", parseError);
        return { success: false, message: "Internal server error." };
      }

      const apparelIndex = data.findIndex((apparel) => apparel.code === code);

      if (apparelIndex !== -1) {
        // update size if it exists, otherwise add a new size
        if (data[apparelIndex].sizes[size]) {
          data[apparelIndex].sizes[size].quantity = quantity;
          data[apparelIndex].sizes[size].price = price;
        } else {
          data[apparelIndex].sizes[size] = { quantity, price };
        }

        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
        return { success: true, message: "updated successfully." };
      } else {
        return { success: false, message: "Cannot not found." };
      }
    } catch (error) {
      console.error("Error updating:", error);
      return { success: false, message: "Internal server error." };
    }
  },

  /**
   * updateMultipleApparels for updating multiple.
   * @param data
   * @returns success true or false
   */
  updateMultipleApparels: (data: any[]) => {
    try {
      const rawData = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const existingData: Apparel[] = JSON.parse(rawData);

      data.forEach((update) => {
        const { code, size, quantity, price } = update;
        const apparelIndex = existingData.findIndex(
          (apparel) => apparel.code === code
        );

        if (apparelIndex !== -1) {
          // update size if it exists, otherwise add a new size
          if (existingData[apparelIndex].sizes[size]) {
            existingData[apparelIndex].sizes[size].quantity = quantity;
            existingData[apparelIndex].sizes[size].price = price;
          } else {
            existingData[apparelIndex].sizes[size] = { quantity, price };
          }
        } else {
          // Here I have added a add option as well, there is no description to add it in docs I have just added for my understanding
          existingData.push({
            code,
            sizes: { [size]: { quantity, price } },
          });
        }
      });

      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(existingData, null, 2));
      return { success: true, message: "updated successfully." };
    } catch (error) {
      console.error("Error updating:", error);
      return { success: false, message: "Internal server error." };
    }
  },

  /**
   * checkFulfillment to check whether a user can fullfill the order. Here I have included the array of apparael in a sense that
   * an order can have multiple request of different sizes.
   * @param order
   * @returns true or false
   */
  checkFulfillment: (order: any[]) => {
    try {
      const rawData = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const data: Apparel[] = JSON.parse(rawData);

      for (const item of order) {
        const { code, size, quantity } = item;
        const apparel = data.find((apparel) => apparel.code === code);

        if (
          !apparel ||
          !apparel.sizes[size] ||
          apparel.sizes[size].quantity < quantity
        ) {
          return { fulfillment: false, message: "Order cannot be fulfilled." };
        }
      }

      return { fulfillment: true, message: "Order can be fulfilled." };
    } catch (error) {
      console.error("Error checking fulfillment:", error);
      return { fulfillment: false, message: "Internal server error." };
    }
  },

  /**
   * getLowestCost, it is array of orders which will calculate the lowest cost for the order.
   * @param order
   * @returns
   */
  getLowestCost: (order: any[]) => {
    try {
      const rawData = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const data: Apparel[] = JSON.parse(rawData);

      let totalCost = 0;

      for (const item of order) {
        const { code, size, quantity } = item;
        const apparel = data.find((apparel) => apparel.code === code);

        if (apparel && apparel.sizes[size]) {
          totalCost += apparel.sizes[size].price * quantity;
        } else {
          return { success: false, message: "Not found." };
        }
      }

      return { success: true, lowestCost: totalCost };
    } catch (error) {
      console.error("Error calculating lowest cost:", error);
      return { success: false, message: "Internal server error." };
    }
  },
};
