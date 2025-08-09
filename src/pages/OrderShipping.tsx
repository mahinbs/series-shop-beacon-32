import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageScrollAnimation } from '@/hooks/usePageScrollAnimation';

const OrderShipping = () => {
  usePageScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Order & Shipping</h1>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Returns & Refunds</h2>
              
              <div className="bg-card p-6 rounded-lg border mb-6">
                <p className="text-muted-foreground mb-4">
                  Crossed hearts does not provide returns or exchange for print books as it gives you the highly personalized order. Kindly provide close attention when approving your order online.
                </p>
                
                <p className="text-muted-foreground mb-4">
                  Cross Hearts definitely will initiate the refund to customers, only when they find their shipment arrives damaged. The customer must share their order number, image/video of the damage and image of the bar code outside the book.
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>NOTE:</strong> The Return & refund will be initiated from Crossed Hearts, only in exceptional cases.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Shipping Information</h2>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground mb-4">
                  For any shipping-related inquiries or to report damaged shipments, please contact our customer support team with the following information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Order number</li>
                  <li>Clear images or video of the damage</li>
                  <li>Image of the barcode outside the book</li>
                  <li>Description of the issue</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderShipping;