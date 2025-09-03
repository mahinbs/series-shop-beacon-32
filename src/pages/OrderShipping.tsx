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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Shipping Methods</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li><strong>Standard Shipping:</strong> 3-7 business days (USA)</li>
                      <li><strong>Express Shipping:</strong> 1-3 business days (USA)</li>
                      <li><strong>International:</strong> 7-14 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Shipping Costs</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li><strong>Free Shipping:</strong> Orders over $50 (USA)</li>
                      <li><strong>Standard:</strong> $5.99 (USA)</li>
                      <li><strong>Express:</strong> $12.99 (USA)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Shipping Updates:</strong> You'll receive tracking information via email once your order ships.
                      </p>
                    </div>
                  </div>
                </div>
                
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