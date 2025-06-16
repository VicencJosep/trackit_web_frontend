import React, { useEffect, useState } from 'react';
import styles from './Warehouse.module.css';
import { GetUserPackets } from '../../services/user.service';
import { updatePacketStatus } from '../../services/user.service';
import { Packet } from '../../types';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface WarehouseProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

const Warehouse: React.FC<WarehouseProps> = ({ user }) => {
  const [packages, setPackages] = useState<Packet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Packet | null>(null);
  const [editedDestination, setEditedDestination] = useState("");
  const [editedDeliveredAt, setEditedDeliveredAt] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const getPackages = async () => {
      try {
        const allPackages = await GetUserPackets(user.id);
        const warehousePackages = allPackages.filter((pkg) => pkg.status === 'almacén');
        setPackages(warehousePackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast.error('Error al obtener los paquetes.', {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    getPackages();
  }, [user.id]);

  const handlePackageClick = (pkg: Packet) => {
    setSelectedPackage(pkg);
    setEditedDestination(pkg.destination || "");
    setEditedDeliveredAt(pkg.deliveredAt ? pkg.deliveredAt.toString().slice(0, 10) : "");
  };

  const handleSaveChanges = async () => {
    if (!selectedPackage) return;

    const createdAt = new Date(selectedPackage.createdAt);
    const newDeliveredDate = editedDeliveredAt ? new Date(editedDeliveredAt) : null;

    if (newDeliveredDate && newDeliveredDate < createdAt) {
      toast.warning(String(t("warehouse.invalidDate")), {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const updatedPacket: Packet = {
      ...selectedPackage,
      destination: editedDestination,
      deliveredAt: newDeliveredDate || undefined,
    };

    try {
      await updatePacketStatus(updatedPacket);
      setPackages((prev) =>
        prev.map((p) => (p._id === updatedPacket._id ? updatedPacket : p))
      );
      setSelectedPackage(null);
      toast.success(String(t("warehouse.updatedSuccess")), {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error updating packet:', error);
      toast.error(String('Error al obtener los paquetes.'), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h1 className={styles.title}>{String(t("warehouse.title"))}</h1>

      {loading ? (
        <p>{String(t("warehouse.loading"))}</p>
      ) : packages.length === 0 ? (
        <p>{String(t("warehouse.empty"))}</p>
      ) : (
        <div className={styles.packagesContainer}>
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={styles.packageCard}
              onClick={() => handlePackageClick(pkg)}
            >
              <h2 className={styles.packageTitle}>{pkg.name}</h2>
              <p className={styles.packageInfo}>
                {String(t("warehouse.description"))}: {pkg.description}
              </p>
              <p className={styles.packageInfo}>
                {String(t("warehouse.weight"))}: {pkg.weight} kg
              </p>
              <p className={styles.packageInfo}>
                {String(t("warehouse.size"))}: {pkg.size} cm³
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedPackage && (
        <div className={styles.editModal}>
          <button className={styles.closeButton} onClick={() => setSelectedPackage(null)}>×</button>
          <h2>{String(t("warehouse.editTitle"))}</h2>
          <label>
            {String(t("warehouse.destination"))}:
            <input
              type="text"
              value={editedDestination}
              onChange={(e) => setEditedDestination(e.target.value)}
            />
          </label>
          <label>
            {String(t("warehouse.deliveredAt"))}:
            <input
              type="date"
              value={editedDeliveredAt}
              min={new Date(selectedPackage.createdAt).toISOString().split("T")[0]}
              onChange={(e) => setEditedDeliveredAt(e.target.value)}
            />
          </label>
          <div className={styles.buttonGroup}>
            <button onClick={handleSaveChanges}>
              {String(t("warehouse.save"))}
            </button>
            <button onClick={() => setSelectedPackage(null)}>
              {String(t("warehouse.cancel"))}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouse;
