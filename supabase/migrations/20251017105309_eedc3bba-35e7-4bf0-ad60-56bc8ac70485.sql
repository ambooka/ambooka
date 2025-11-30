-- Create portfolio_content table to store portfolio information
CREATE TABLE public.portfolio_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read portfolio content (public portfolio)
CREATE POLICY "Portfolio content is publicly readable" 
ON public.portfolio_content 
FOR SELECT 
USING (true);

-- Create index for better search performance
CREATE INDEX idx_portfolio_content_search ON public.portfolio_content USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_portfolio_content_tags ON public.portfolio_content USING gin(tags);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_portfolio_content_updated_at
BEFORE UPDATE ON public.portfolio_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();