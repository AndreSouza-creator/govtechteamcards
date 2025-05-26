
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageUrlChange: (url: string | null) => void;
  memberName?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImageUrl, 
  onImageUrlChange, 
  memberName 
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('team-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('team-photos')
        .getPublicUrl(filePath);

      setPreviewUrl(data.publicUrl);
      onImageUrlChange(data.publicUrl);

      toast({
        title: "Sucesso",
        description: "Imagem carregada com sucesso!"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar a imagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro", 
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive"
        });
        return;
      }

      uploadImage(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onImageUrlChange(null);
  };

  return (
    <div className="space-y-4">
      <Label className="text-white">Foto do Colaborador</Label>
      
      {previewUrl ? (
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-300">
            <img
              src={previewUrl}
              alt={memberName || "Preview"}
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeImage}
            className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-300 bg-gray-100 flex items-center justify-center">
          <User className="h-12 w-12 text-gray-400" />
        </div>
      )}

      <div className="text-center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <Label
          htmlFor="image-upload"
          className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Carregando...' : 'Selecionar Foto'}
        </Label>
      </div>
      
      <p className="text-xs text-gray-400 text-center">
        Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
      </p>
    </div>
  );
};

export default ImageUpload;
