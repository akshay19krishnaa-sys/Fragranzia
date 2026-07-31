import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AddressService = () => {
  const axiosPrivate = useAxiosPrivate();

  const addAddress = async (data) => {
    const res = await axiosPrivate.post("/api/address", data);
    return res.data;
  };

  const getAddresses = async () => {
    const res = await axiosPrivate.get("/api/address");
    return res.data;
  };

  const makePrimary = async (id) => {
    const res = await axiosPrivate.put(`/api/address/primary/${id}`);
    return res.data;
  };

  const deleteAddress = async (id) => {
    const res = await axiosPrivate.delete(`/api/address/${id}`);
    return res.data;
  };

  const getAddressById = async (id) => {
    const res = await axiosPrivate.get(`/api/address/${id}`);
    return res.data;
  };

  const updateAddress = async (id, data) => {
    const res = await axiosPrivate.put(`/api/address/${id}`, data);
    return res.data;
  };

  return {
    addAddress,
    getAddresses,
    makePrimary,
    deleteAddress,
    getAddressById,
    updateAddress,
  };
};

export default AddressService;