import { Head, useForm } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Select from 'react-select';
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ImageIcon, PackageSearch } from "lucide-react"; // icons
import { ClipLoader } from "react-spinners";
import DashboardLayout from "../DashboardLayout";
import Breadcrumbs from "@/Components/Breadcrumb";

export default function Create({ items, selectedItem, breadcrumbs }) {
    const { data, setData, post, errors, reset, processing } = useForm({
        item_id: selectedItem? selectedItem.data.id:'',
        quantity: '',
        price: '',
        supplied_by: 'Self Purchase',
        item_name: selectedItem?selectedItem.data.title:'',
        image: null
    });

    const [preview, setPreview] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("stock.store"), {
            onSuccess: () => {
                reset();
                setPreview(null);
                toast.success("Stock successfully added");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onError: (errors) => {
                toast.error("Failed to add stock. Please check your input.");
                console.error(errors);
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const options = items.data.map(item => ({
        value: item.id,
        label: item.item_name,
    }));

    return (
        <DashboardLayout>
            <Head title="Items" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <div className="p-8">
                <div className="bg-white p-6 md:p-6">
                    <div className="rounded-lg p-6 overflow-scroll max-h-[45rem]">
                        <div className="flex items-center gap-2">
                            <PackageSearch className="text-green-700" />
                            <p className="text-xl font-bold text-green-800"> New Stock Entry</p>
                        </div>
                        <hr className="mt-3" />
                        <form onSubmit={onSubmit} encType="multipart/form-data">
                            {/* Select Item */}
                            <div className="mt-3">
                                <InputLabel htmlFor="item_id" value="Select Item" />
                                <Select
                                    options={options}
                                    onChange={option => setData('item_id', option.value)}
                                    className="mt-2"
                                    defaultValue={options.find(opt => opt.value === data.item_id)}
                                    placeholder="Search or select item"
                                />
                                <InputError className="text-red-600" message={errors.item_id} />
                            </div>

                            {/* Price */}
                            <div className="mt-3">
                                <InputLabel htmlFor="item_price" value="Price *" />
                                <TextInput
                                    name="price"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    className="block w-full mt-2"
                                    type="number"
                                    isFocused={true}
                                />
                                <InputError className="text-red-600" message={errors.price} />
                            </div>

                            {/* Quantity */}
                            <div className="mt-3">
                                <InputLabel htmlFor="quantity" value="Quantity *" />
                                <TextInput
                                    name="quantity"
                                    value={data.quantity}
                                    onChange={e => setData('quantity', e.target.value)}
                                    className="block w-full mt-2"
                                    type="number"
                                />
                                <InputError className="text-red-600" message={errors.quantity} />
                            </div>

                            {/* Supplied By */}
                            <div className="mt-3">
                                <InputLabel htmlFor="supplied_by" value="Supplied by" />
                                <TextInput
                                    name="supplied_by"
                                    value={data.supplied_by}
                                    onChange={e => setData('supplied_by', e.target.value)}
                                    className="block w-full mt-2"
                                    type="text"
                                />
                                <InputError className="text-red-600" message={errors.supplied_by} />
                            </div>

                            {/* Image Upload */}
                            {/* <div className="mt-6">
                                <InputLabel value="Upload Image (optional)" />
                                <label className="cursor-pointer flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-md mt-2 hover:border-green-400 transition">
                                    <ImageIcon />
                                    <span className="text-sm text-gray-700">Choose image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <InputError className="text-red-600" message={errors.image} />
                                {preview && (
                                    <img src={preview} alt="Preview" className="mt-3 h-32 rounded-md object-contain" />
                                )}
                            </div> */}

                            {/* Submit */}
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 px-8 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
                                    disabled={processing}
                                >
                                    {processing ? <ClipLoader color="#fff" size={20} /> : null}
                                    {processing ? "Saving..." : "Save Stock"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
