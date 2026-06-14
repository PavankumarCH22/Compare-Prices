import Alert from '../models/Alert.js';
import Product from '../models/Product.js';

// @desc    Create price drop alert
// @route   POST /api/alerts
// @access  Private
export const createAlert = async (req, res) => {
  try {
    const { productId, targetPrice, email } = req.body;
    
    const alert = new Alert({
      userId: req.user._id,
      productId,
      targetPrice,
      email,
      status: 'active'
    });
    
    const createdAlert = await alert.save();
    res.status(201).json(createdAlert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user alerts
// @route   GET /api/alerts
// @access  Private
export const getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user._id }).populate('productId');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private
export const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (alert) {
      if (alert.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
      }
      await Alert.deleteOne({ _id: alert._id });
      res.json({ message: 'Alert removed' });
    } else {
      res.status(404).json({ message: 'Alert not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
