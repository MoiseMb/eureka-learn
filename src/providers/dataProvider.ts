import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export type ListParams = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
}

export const useGetList = (resource: string, params: ListParams = {}) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = '',
        filters = {}
    } = params;

    return useQuery({
        queryKey: [resource, 'list', { page, limit, sortBy, sortOrder, search, ...filters }],
        queryFn: async () => {
            const response = await api.get(`${resource}`, {
                params: {
                    page,
                    limit,
                    sortBy,
                    sortOrder,
                    search,
                    ...filters
                }
            });
            return response.data;
        }
    });
};

export const useGetResourcesInfinite = (resource: string, filters?: any) => {
    // const { searchQuery } = useSearch();
    return useInfiniteQuery({
        queryKey: [`${resource}s`, 'infinite', filters],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await api.get(resource, {
                params: {
                    offset: pageParam,
                    ...filters,
                    // name: searchQuery
                }
            });
            return response.data;
        },
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.data.length < 10) return undefined;
            return pages.length * 10;
        },
        initialPageParam: 0
    });
};


export const useCreateResource = <TData, TVariables>(resource: string) => {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables>({
        mutationFn: (data: TVariables) => {
            return api.post(resource, data).then(res => res.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${resource}s`] });
        }
    });
};

export const useUpdateResource = <TData, TVariables>(resource: string) => {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables>({
        mutationFn: (data: any) => {
            const { id, ...newData } = data;
            return api.put(`${resource}/${data.id}`, newData).then(res => res.data);
        },
        onSuccess: (_, variables) => {
            let id: string;
            if (variables instanceof FormData) {
                id = variables.get('id') as string;
            } else {
                id = (variables as any).id;
            }

            queryClient.invalidateQueries({ queryKey: [`${resource}s`] });
            queryClient.invalidateQueries({ queryKey: [resource, id] });
        }
    });
};


export const useUpdateResourceWithImage = <TData, TVariables>(resource: string) => {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, { id: string; data?: any; photo?: any }>({
        mutationFn: async ({ id, data, photo }) => {
            const formData = new FormData();

            if (photo) {
                const timestamp = new Date().getTime();
                const fileExtension = photo.split('.').pop();
                const filename = `${resource}_image_${timestamp}.${fileExtension}`;

                formData.append('image', {
                    uri: photo,
                    name: filename,
                    type: `image/${fileExtension}`,
                } as any);
            }
            if (data) {
                Object.keys(data).forEach(key => {
                    formData.append(key, JSON.stringify(data[key]));
                });
            }

            return api.put(`${resource}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => res.data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [`${resource}s`] });
            queryClient.invalidateQueries({ queryKey: [resource, variables.id] });
        }
    });
};


export const useDeleteResource = <TData>(resource: string) => {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, string>({
        mutationFn: (id: string) => {
            return api.delete(`${resource}/${id}`).then(res => res.data);
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: [`${resource}s`] });
            queryClient.invalidateQueries({ queryKey: [resource, id] });
        }
    });
};

export const useGetResource = <TData>(resource: string, id: string | null) => {
    return useQuery<TData, Error>({
        queryKey: [resource, id],
        queryFn: async () => {
            const response = await api.get(`${resource}/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};
export const useGetResourceWithoutParams = <TData>(resource: string) => {
    return useQuery<TData, Error>({
        queryKey: [resource],
        queryFn: async () => {
            const response = await api.get(resource);
            return response.data;
        },
    });
};

export const useFileResource = <TData>(resource: string) => {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, FormData>({
        mutationFn: (formData: FormData) => {
            return api.post(resource, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => res.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`${resource}s`] });
        }
    });
};
