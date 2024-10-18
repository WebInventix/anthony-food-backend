const mongoose = require("mongoose");
const { Vendors } = require("../../models/vendors");
const { Stores } = require("../../models/stores");

// const addVendor = async (req,res) => {
//     const {body} = req;
//     const {name,email,phonenumber,avatar,store_id,category,type,vproducts} = body
//     try {
//         let allproducts = vproducts;
//         if (typeof vproducts === 'string') {
//             productsArray = JSON.parse(vproducts);
//         }
//         let st = (!store_id) ? null:store_id

//         const vendor = new Vendors({name,email,phonenumber,avatar,store_id:st,category,status:'Active',allproducts,type})
//         await vendor.save()
//         return res.status(200).json({message:'Vendor Added Successfully',vendor})

//     } catch (error) {
//         return res.status(500).json({message:error.message})

//     }
// }

const addVendor = async (req, res) => {
  const { body } = req;
  const {
    name,
    email,
    phonenumber,
    avatar,
    store_id,
    category,
    type,
    vproducts,
  } = body;

  try {
    let allproducts = vproducts;
    if (typeof vproducts === "string") {
      allproducts = JSON.parse(vproducts);
    }

    const vendors = [];

    if (type === "All" && !store_id) {
      // Fetch all active stores that are not deleted
      const stores = await Stores.find({ isDeleted: false, status: "Active" });

      if (!stores || stores.length === 0) {
        return res.status(404).json({ message: "No active stores found" });
      }

      // Create a vendor for each active store
      for (const store of stores) {
        const vendor = new Vendors({
          name,
          email,
          phonenumber,
          avatar,
          store_id: store._id,
          category,
          status: "Active",
          allproducts,
          type,
        });

        await vendor.save();
        vendors.push(vendor);
      }
    } else {
      // If type is "Single" or a specific store_id is provided
      const st = store_id || null;

      const vendor = new Vendors({
        name,
        email,
        phonenumber,
        avatar,
        store_id: st,
        category,
        status: "Active",
        allproducts,
        type,
      });

      await vendor.save();
      vendors.push(vendor);
    }

    // Return the created vendors
    return res.status(200).json({
      message: "Vendor(s) Added Successfully",
      data: vendors,
    });
  } catch (error) {
    // Handle any errors during the process
    return res.status(500).json({
      message: "Error adding vendors",
      error: error.message,
    });
  }
};

const getVendor = async (req, res) => {
  const { params } = req;
  const { id } = params;
  try {
    const vendor = await Vendors.find({
      $or: [{ store_id: id }, { type: "All" }],
      status: { $ne: "Deleted" },
    })
      .populate("store_id")
      .populate("category")
      .populate("allproducts");

    return res
      .status(200)
      .json({ message: "Vendor Fetched Successfully", vendor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteVendor = async (req, res) => {
  const { params } = req;
  const { id } = params;
  try {
    let vendor = await Vendors.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor Not Found" });
    }
    vendor.status = "Deleted";
    await vendor.save();
    return res
      .status(200)
      .json({ message: "Vendor Deleted Successfully", vendor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendors.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor Not Found" });
    }

    Object.assign(vendor, req.body);

    await vendor.save();

    res.status(200).json({
      status: "success",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  addVendor,
  getVendor,
  deleteVendor,
  updateVendor,
};
