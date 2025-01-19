'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast'; // Make sure to install react-hot-toast

interface FormData {
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'draft';
    image: File | null;
}

const CreateJobPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        status: 'active',
        image: null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = (value: 'active' | 'inactive' | 'draft') => {
        setFormData(prev => ({
            ...prev,
            status: value
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Image size must be less than 10MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }));
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const tokenRes = await fetch('/token');
            if (!tokenRes.ok) {
                throw new Error('Failed to fetch authentication token');
            }
            const tokenData = await tokenRes.json();

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('status', formData.status);
            
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const response = await fetch(`http://localhost:8000/jobWrite`, {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Authorization': `Bearer ${tokenData.idToken}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to create job');
            }

            const result = await response.json();
            toast.success('Job created successfully!');
            router.push('/'); // Redirect to jobs list
        } catch (error) {
            console.error('Error creating job:', error);
            toast.error('Failed to create job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Create New Job</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Job Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter job name"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter job description"
                                required
                                className="min-h-32"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={handleStatusChange}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Job Image</Label>
                            <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg border-gray-300 hover:border-gray-400 transition-colors">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={loading}
                                />
                                {imagePreview ? (
                                    <div className="relative w-full aspect-video">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setFormData(prev => ({ ...prev, image: null }));
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                            disabled={loading}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="image"
                                        className="flex flex-col items-center cursor-pointer p-4"
                                    >
                                        <Upload className="w-12 h-12 text-gray-400" />
                                        <span className="mt-2 text-sm text-gray-500">
                                            Click to upload or drag and drop
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            PNG, JPG, GIF up to 10MB
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Job'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateJobPage;