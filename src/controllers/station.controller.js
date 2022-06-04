const deviceModel = require('../models/device.model');
exports.create = async (req, res) => {
  const { name, value, stationType } = req.body;
  try {
    const newDevice = await deviceModel.create({
      name,
      value,
      stationType,
    });
    res.status(201).json({
      device: newDevice,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred. Please Try again.',
      error: error,
    });
  }
};
exports.findAll = async (req, res) => {
  try {
    const devices = await deviceModel.find();
    res.status(200).json({
      devices: devices,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred. Please Try again.',
    });
  }
};
exports.subAll = async (req, res) => {
  try {
    const devices = await deviceModel.find({ stationType: 1 });
    res.status(200).json({
      devices: devices,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred. Please Try again.',
    });
  }
};

exports.updateAll = async (req, res) => {
  try {
    console.log(req.body);
    const { documents } = req.body;
    documents.forEach(async document => {
      await deviceModel.findByIdAndUpdate(
        (id = document._id),
        {
          value: document.value >= 0 ? document.value.toFixed(2) : 0,
        },
        {
          new: true,
        }
      );
    });

    // const device = await deviceModel.findByIdAndUpdate(
    //   id,
    //   {
    //     name,
    //     value,
    //     stationType
    //   },
    //   {
    //     new: true
    //   }
    // );
    res.status(200).json({
      message: 'update successful',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error occurred. Please Try again.',
      error: error,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const device = await deviceModel.findById(id);
    res.status(200).json({
      device,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred. Please Try again.',
    });
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, value, stationType } = req.body;
    const device = await deviceModel.findByIdAndUpdate(
      id,
      {
        name,
        value,
        stationType,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      device,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error occurred. Please Try again.',
      error: error,
    });
  }
};
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const device = await deviceModel.findByIdAndDelete(id);
    res.status(200).json({
      device,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred. Please Try again.',
    });
  }
};
