import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      // inicia cada notificação como não-lida
      default: false,
    },
  },
  {
    // ter controle do momento que foi criada/modificada
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);
